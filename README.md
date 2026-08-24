# LocoMart Seller Hub

Build a premium production-ready Seller Dashboard for a startup called "LocoMart".

Tech Stack:

- React 19

- Vite

- TypeScript

- Tailwind CSS

- React Router

- React Icons

- Framer Motion

- Recharts

- Axios

Theme:

Modern SaaS UI inspired by Shopify Admin, Stripe Dashboard, Amazon Seller Central, Blinkit Merchant, and Swiggy Merchant.

Primary Color:

#16a34a (Green)

Secondary:

White

Slate Gray

Emerald

Light Gray

The UI must be responsive for:

- Desktop

- Tablet

- Mobile

Use clean reusable components.

Project structure:

src/

 components/

    common/

    layout/

    dashboard/

    orders/

    products/

    analytics/

    inventory/

    reviews/

    notifications/

    settings/

    charts/

 pages/

 routes/

 hooks/

 services/

 context/

 types/

 utils/

----------------------------------------------------

SIDEBAR

----------------------------------------------------

Create a collapsible sidebar.

Logo:

LocoMart Seller

Menu:

Dashboard

Orders

Products

Categories

Inventory

Customers

Analytics

Offers

Reviews

Wallet

Notifications

Store Settings

Profile

Logout

Highlight active menu.

Icons from react-icons.

----------------------------------------------------

TOP NAVBAR

----------------------------------------------------

Search Bar

Notification Bell

Messages

Dark Mode Toggle

Store Online/Offline Toggle

Profile Avatar

----------------------------------------------------

DASHBOARD HOME

----------------------------------------------------

Beautiful hero banner

"Welcome Back"

Summary Cards:

Today's Revenue

Today's Orders

Pending Orders

Delivered Orders

Cancelled Orders

Products

Customers

Wallet Balance

Growth %

Average Rating

----------------------------------------------------

ANALYTICS

----------------------------------------------------

Revenue Chart

Orders Chart

Monthly Sales

Weekly Sales

Top Categories

Revenue by Category

Best Selling Products

Recent Performance

Use Recharts.

----------------------------------------------------

RECENT ORDERS

----------------------------------------------------

Professional table.

Columns:

Customer

Order ID

Product

Amount

Payment

Order Status

Delivery Status

Action

Status badges:

Pending

Accepted

Preparing

Ready

Out for Delivery

Delivered

Cancelled

----------------------------------------------------

PRODUCTS

----------------------------------------------------

Professional Product Management.

Search

Filters

Pagination

Grid View

Table View

Each Product Card contains:

Image

Title

Price

Discount

Category

Stock

Rating

Sales Count

Buttons:

Edit

Delete

Duplicate

----------------------------------------------------

ADD PRODUCT

----------------------------------------------------

Large form.

Fields:

Product Images (Multiple Upload)

Product Name

Description

Category

Sub Category

Brand

SKU

Barcode

Price

Discount

MRP

GST

Weight

Dimensions

Available Stock

Low Stock Alert

Delivery Charges

Tags

Publish Toggle

Save Draft

Publish

----------------------------------------------------

INVENTORY

----------------------------------------------------

Inventory Dashboard

Low Stock Products

Out of Stock

Stock Movement

Inventory History

----------------------------------------------------

CUSTOMERS

----------------------------------------------------

Customer List

Customer Details

Orders

Wallet

Loyal Customers

----------------------------------------------------

REVIEWS

----------------------------------------------------

Average Rating

Rating Breakdown

Customer Reviews

Reply to Review

----------------------------------------------------

OFFERS

----------------------------------------------------

Coupons

Discounts

Flash Sales

Banner Management

----------------------------------------------------

WALLET

----------------------------------------------------

Total Earnings

Pending Payments

Withdraw Amount

Transactions

----------------------------------------------------

NOTIFICATIONS

----------------------------------------------------

Live notifications

Orders

Payments

Reviews

----------------------------------------------------

STORE SETTINGS

----------------------------------------------------

Store Name

Store Logo

Store Banner

Business Details

Address

GST Number

Bank Details

Delivery Radius

Opening Hours

Store Online Toggle

----------------------------------------------------

PROFILE

----------------------------------------------------

Seller Profile

Edit Profile

Change Password

Security

----------------------------------------------------

DESIGN REQUIREMENTS

----------------------------------------------------

Rounded Cards

Large Shadows

Soft Gradients

Glassmorphism

Hover Effects

Smooth Animations

Framer Motion

Modern Buttons

Beautiful Empty States

Professional Charts

Responsive Tables

Loading Skeletons

Toast Notifications

----------------------------------------------------

DATA

----------------------------------------------------

Use dummy JSON data.

Create mock API services.

Separate all dummy data inside /services/mockApi.ts.

----------------------------------------------------

CODE QUALITY

----------------------------------------------------

Reusable Components

Strict TypeScript

No inline styles.

Clean folder structure.

Proper interfaces.

No repeated code.

Professional naming conventions.

----------------------------------------------------

GOAL

----------------------------------------------------

Generate the complete project with all pages, components, routes, reusable layouts, mock data and responsive design.

The code should look like a production SaaS dashboard suitable for a real startup called LocoMart.


## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
