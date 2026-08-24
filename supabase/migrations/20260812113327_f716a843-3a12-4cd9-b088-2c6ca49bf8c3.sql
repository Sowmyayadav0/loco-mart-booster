
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;

CREATE OR REPLACE FUNCTION public.quote_coupon(_user_id UUID, _code TEXT, _subtotal NUMERIC, _store_id UUID)
RETURNS TABLE (discount NUMERIC, coupon_id UUID, message TEXT)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE c public.coupons%ROWTYPE; d NUMERIC := 0; used INT;
BEGIN
  SELECT * INTO c FROM public.coupons WHERE upper(code) = upper(_code) AND is_active;
  IF NOT FOUND THEN RETURN QUERY SELECT 0::NUMERIC, NULL::UUID, 'Invalid coupon code'; RETURN; END IF;
  IF c.expires_at IS NOT NULL AND c.expires_at < now() THEN RETURN QUERY SELECT 0::NUMERIC, NULL::UUID, 'This coupon has expired'; RETURN; END IF;
  IF c.usage_limit IS NOT NULL AND c.used_count >= c.usage_limit THEN RETURN QUERY SELECT 0::NUMERIC, NULL::UUID, 'This coupon is fully redeemed'; RETURN; END IF;
  IF c.store_id IS NOT NULL AND c.store_id <> _store_id THEN RETURN QUERY SELECT 0::NUMERIC, NULL::UUID, 'Coupon not valid for this store'; RETURN; END IF;
  IF _subtotal < c.min_order THEN RETURN QUERY SELECT 0::NUMERIC, NULL::UUID, 'Add items worth Rs.' || (c.min_order - _subtotal)::INT || ' more to use this coupon'; RETURN; END IF;
  SELECT count(*) INTO used FROM public.coupon_redemptions WHERE coupon_id = c.id AND user_id = _user_id;
  IF used >= c.per_user_limit THEN RETURN QUERY SELECT 0::NUMERIC, NULL::UUID, 'You have already used this coupon'; RETURN; END IF;
  IF c.type = 'PERCENT' THEN d := round(_subtotal * c.value / 100, 2);
  ELSE d := c.value; END IF;
  IF c.max_discount IS NOT NULL AND d > c.max_discount THEN d := c.max_discount; END IF;
  IF d > _subtotal THEN d := _subtotal; END IF;
  RETURN QUERY SELECT d, c.id, 'Coupon applied';
END; $$;
REVOKE ALL ON FUNCTION public.quote_coupon(uuid, text, numeric, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.quote_coupon(uuid, text, numeric, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.place_order(
  _address_id UUID,
  _payment_method public.payment_method,
  _coupon_code TEXT DEFAULT NULL,
  _tip NUMERIC DEFAULT 0,
  _instructions TEXT DEFAULT NULL,
  _scheduled_for TIMESTAMPTZ DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid UUID := auth.uid();
  v_store UUID; v_stores INT; v_subtotal NUMERIC := 0;
  v_discount NUMERIC := 0; v_coupon UUID; v_msg TEXT;
  v_tax NUMERIC; v_delivery NUMERIC; v_platform NUMERIC := 7; v_total NUMERIC;
  v_addr public.addresses%ROWTYPE; v_store_row public.stores%ROWTYPE;
  v_tip NUMERIC := GREATEST(COALESCE(_tip,0), 0);
  v_order UUID; v_code TEXT; r RECORD; v_balance NUMERIC;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'AUTH_REQUIRED'; END IF;
  SELECT * INTO v_addr FROM public.addresses WHERE id = _address_id AND user_id = uid;
  IF NOT FOUND THEN RAISE EXCEPTION 'INVALID_ADDRESS'; END IF;

  CREATE TEMP TABLE _lines ON COMMIT DROP AS
    SELECT p.id AS product_id, p.store_id, p.name, p.image_url, p.unit, p.price, p.stock,
           p.is_available, ci.quantity
    FROM public.cart_items ci JOIN public.products p ON p.id = ci.product_id
    WHERE ci.user_id = uid AND ci.saved_for_later = false;

  IF NOT EXISTS (SELECT 1 FROM _lines) THEN RAISE EXCEPTION 'CART_EMPTY'; END IF;
  SELECT count(DISTINCT store_id), min(store_id) INTO v_stores, v_store FROM _lines;
  IF v_stores > 1 THEN RAISE EXCEPTION 'MULTI_STORE_CART'; END IF;

  FOR r IN SELECT * FROM _lines LOOP
    IF NOT r.is_available OR r.stock < r.quantity THEN
      RAISE EXCEPTION 'OUT_OF_STOCK:%', r.name;
    END IF;
  END LOOP;

  SELECT COALESCE(sum(price * quantity),0) INTO v_subtotal FROM _lines;
  SELECT * INTO v_store_row FROM public.stores WHERE id = v_store;
  IF NOT v_store_row.is_open OR NOT v_store_row.is_active THEN RAISE EXCEPTION 'STORE_CLOSED'; END IF;
  IF v_subtotal < v_store_row.min_order THEN RAISE EXCEPTION 'MIN_ORDER_NOT_MET'; END IF;

  IF _coupon_code IS NOT NULL AND length(trim(_coupon_code)) > 0 THEN
    SELECT q.discount, q.coupon_id, q.message INTO v_discount, v_coupon, v_msg
    FROM public.quote_coupon(uid, _coupon_code, v_subtotal, v_store) q;
    IF v_coupon IS NULL THEN RAISE EXCEPTION 'COUPON_INVALID:%', v_msg; END IF;
  END IF;

  v_delivery := CASE WHEN v_subtotal >= 499 THEN 0 ELSE v_store_row.delivery_fee END;
  v_tax := round((v_subtotal - v_discount) * 0.05, 2);
  v_total := round(v_subtotal - v_discount + v_tax + v_delivery + v_platform + v_tip, 2);
  v_code := 'LM' || to_char(now(),'YYMMDD') || upper(substr(replace(gen_random_uuid()::text,'-',''),1,5));

  IF _payment_method = 'WALLET' THEN
    SELECT balance INTO v_balance FROM public.wallets WHERE user_id = uid FOR UPDATE;
    IF v_balance IS NULL OR v_balance < v_total THEN RAISE EXCEPTION 'INSUFFICIENT_WALLET_BALANCE'; END IF;
  END IF;

  INSERT INTO public.orders (
    code, user_id, store_id, address, contact_phone, instructions, scheduled_for, coupon_code,
    subtotal, discount, tax, delivery_fee, platform_fee, tip, total,
    payment_method, payment_status, eta_minutes
  ) VALUES (
    v_code, uid, v_store,
    jsonb_build_object('label', v_addr.label, 'house', v_addr.house, 'street', v_addr.street,
      'area', v_addr.area, 'landmark', v_addr.landmark, 'city', v_addr.city, 'state', v_addr.state,
      'pincode', v_addr.pincode, 'latitude', v_addr.latitude, 'longitude', v_addr.longitude),
    COALESCE(v_addr.contact_phone, (SELECT phone FROM public.profiles WHERE id = uid)),
    _instructions, _scheduled_for, CASE WHEN v_coupon IS NULL THEN NULL ELSE upper(_coupon_code) END,
    v_subtotal, v_discount, v_tax, v_delivery, v_platform, v_tip, v_total,
    _payment_method,
    CASE WHEN _payment_method = 'WALLET' THEN 'PAID'::public.payment_status ELSE 'PENDING'::public.payment_status END,
    v_store_row.delivery_minutes
  ) RETURNING id INTO v_order;

  INSERT INTO public.order_items (order_id, product_id, name, image_url, unit, price, quantity, total)
  SELECT v_order, product_id, name, image_url, unit, price, quantity, price * quantity FROM _lines;

  UPDATE public.products p SET stock = p.stock - l.quantity, sales = p.sales + l.quantity
  FROM _lines l WHERE p.id = l.product_id;

  IF _payment_method = 'WALLET' THEN
    UPDATE public.wallets SET balance = balance - v_total, updated_at = now() WHERE user_id = uid RETURNING balance INTO v_balance;
    INSERT INTO public.wallet_transactions (user_id, type, amount, balance_after, label, order_id)
    VALUES (uid, 'DEBIT', v_total, v_balance, 'Payment for order ' || v_code, v_order);
  END IF;

  IF v_coupon IS NOT NULL THEN
    UPDATE public.coupons SET used_count = used_count + 1 WHERE id = v_coupon;
    INSERT INTO public.coupon_redemptions (coupon_id, user_id, order_id, discount) VALUES (v_coupon, uid, v_order, v_discount);
  END IF;

  INSERT INTO public.order_status_history (order_id, status, note) VALUES (v_order, 'PLACED', 'Order placed successfully');
  INSERT INTO public.notifications (user_id, type, title, message, order_id)
  VALUES (uid, 'ORDER_UPDATE', 'Order placed', 'Your order ' || v_code || ' has been placed.', v_order);

  DELETE FROM public.cart_items WHERE user_id = uid AND saved_for_later = false;
  RETURN v_order;
END; $$;
REVOKE ALL ON FUNCTION public.place_order(uuid, public.payment_method, text, numeric, text, timestamptz) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.place_order(uuid, public.payment_method, text, numeric, text, timestamptz) TO authenticated;

CREATE OR REPLACE FUNCTION public.cancel_order(_order_id UUID, _reason TEXT DEFAULT NULL)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid UUID := auth.uid(); o public.orders%ROWTYPE; v_balance NUMERIC;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'AUTH_REQUIRED'; END IF;
  SELECT * INTO o FROM public.orders WHERE id = _order_id AND user_id = uid FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'ORDER_NOT_FOUND'; END IF;
  IF o.status NOT IN ('PLACED','ACCEPTED','PREPARING') THEN RAISE EXCEPTION 'CANCEL_NOT_ALLOWED'; END IF;

  UPDATE public.orders SET status = 'CANCELLED', cancelled_reason = _reason,
    payment_status = CASE WHEN o.payment_status = 'PAID' THEN 'REFUNDED'::public.payment_status ELSE o.payment_status END
  WHERE id = o.id;
  INSERT INTO public.order_status_history (order_id, status, note) VALUES (o.id, 'CANCELLED', COALESCE(_reason,'Cancelled by customer'));

  UPDATE public.products p SET stock = p.stock + oi.quantity
  FROM public.order_items oi WHERE oi.order_id = o.id AND p.id = oi.product_id;

  IF o.payment_status = 'PAID' THEN
    UPDATE public.wallets SET balance = balance + o.total, updated_at = now() WHERE user_id = uid RETURNING balance INTO v_balance;
    INSERT INTO public.wallet_transactions (user_id, type, amount, balance_after, label, order_id)
    VALUES (uid, 'REFUND', o.total, v_balance, 'Refund for order ' || o.code, o.id);
  END IF;

  INSERT INTO public.notifications (user_id, type, title, message, order_id)
  VALUES (uid, 'ORDER_UPDATE', 'Order cancelled', 'Order ' || o.code || ' was cancelled.', o.id);
END; $$;
REVOKE ALL ON FUNCTION public.cancel_order(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cancel_order(uuid, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.advance_order(_order_id UUID)
RETURNS public.order_status LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid UUID := auth.uid(); o public.orders%ROWTYPE; nxt public.order_status; v_balance NUMERIC; cashback NUMERIC;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'AUTH_REQUIRED'; END IF;
  SELECT * INTO o FROM public.orders WHERE id = _order_id AND user_id = uid FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'ORDER_NOT_FOUND'; END IF;
  nxt := CASE o.status
    WHEN 'PLACED' THEN 'ACCEPTED' WHEN 'ACCEPTED' THEN 'PREPARING' WHEN 'PREPARING' THEN 'READY'
    WHEN 'READY' THEN 'PICKED_UP' WHEN 'PICKED_UP' THEN 'ON_THE_WAY' WHEN 'ON_THE_WAY' THEN 'DELIVERED'
    ELSE NULL END;
  IF nxt IS NULL THEN RETURN o.status; END IF;

  UPDATE public.orders SET status = nxt,
    rider_name = COALESCE(rider_name, CASE WHEN nxt IN ('READY','PICKED_UP','ON_THE_WAY','DELIVERED') THEN 'Ravi Teja' END),
    rider_phone = COALESCE(rider_phone, CASE WHEN nxt IN ('READY','PICKED_UP','ON_THE_WAY','DELIVERED') THEN '+91 98490 11223' END),
    rider_vehicle = COALESCE(rider_vehicle, CASE WHEN nxt IN ('READY','PICKED_UP','ON_THE_WAY','DELIVERED') THEN 'AP 37 BX 4412' END),
    eta_minutes = GREATEST(COALESCE(eta_minutes,20) - 4, 2),
    delivered_at = CASE WHEN nxt = 'DELIVERED' THEN now() ELSE delivered_at END,
    payment_status = CASE WHEN nxt = 'DELIVERED' AND o.payment_method = 'COD' THEN 'PAID'::public.payment_status ELSE o.payment_status END
  WHERE id = o.id;

  INSERT INTO public.order_status_history (order_id, status) VALUES (o.id, nxt);
  INSERT INTO public.notifications (user_id, type, title, message, order_id)
  VALUES (uid, 'ORDER_UPDATE', 'Order ' || replace(nxt::text,'_',' '), 'Order ' || o.code || ' is now ' || replace(nxt::text,'_',' ') || '.', o.id);

  IF nxt = 'DELIVERED' THEN
    cashback := round(o.total * 0.02, 2);
    IF cashback > 0 THEN
      UPDATE public.wallets SET balance = balance + cashback, updated_at = now() WHERE user_id = uid RETURNING balance INTO v_balance;
      INSERT INTO public.wallet_transactions (user_id, type, amount, balance_after, label, order_id)
      VALUES (uid, 'CASHBACK', cashback, v_balance, '2% cashback on order ' || o.code, o.id);
    END IF;
  END IF;
  RETURN nxt;
END; $$;
REVOKE ALL ON FUNCTION public.advance_order(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.advance_order(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.wallet_topup(_amount NUMERIC)
RETURNS NUMERIC LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid UUID := auth.uid(); v_balance NUMERIC;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'AUTH_REQUIRED'; END IF;
  IF _amount IS NULL OR _amount <= 0 OR _amount > 10000 THEN RAISE EXCEPTION 'INVALID_AMOUNT'; END IF;
  INSERT INTO public.wallets (user_id, balance) VALUES (uid, 0) ON CONFLICT (user_id) DO NOTHING;
  UPDATE public.wallets SET balance = balance + _amount, updated_at = now() WHERE user_id = uid RETURNING balance INTO v_balance;
  INSERT INTO public.wallet_transactions (user_id, type, amount, balance_after, label)
  VALUES (uid, 'CREDIT', _amount, v_balance, 'Money added to LocoMart wallet');
  RETURN v_balance;
END; $$;
REVOKE ALL ON FUNCTION public.wallet_topup(numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.wallet_topup(numeric) TO authenticated;
