CREATE DATABASE main_postgres_db;

create table users(
    id SERIAL PRIMARY KEY,
    name varchar(255) UNIQUE,
    bio text,
    signupSource varchar(255) default 'organic',
    isGuest boolean default false,
    signupDate TIMESTAMPTZ NOT NULL DEFAULT(GETDATE()),
    avgRating real default 0,
    email varchar(255) UNIQUE,
    password varchar(255) not null,
    sellerPts int,
    buyerPts int,
    firstName varchar(255),
    stripecustomerid varchar(255),
    adyenAccountCode varchar(255),
    adyenAccountStatus int, --0 = not created, 1 = not verified, 2 = active/verified, 3 = refused/error  
    lastName varchar(255),
    profilePicture varchar(255),
    shippingCity varchar(255),
    shippingZipCode varchar(255),
    shippingState varchar(255),
    shippingAddress varchar(255),
    shippingCountry varchar(255),
    isAccountSetup boolean default false,
    description varchar(255)
);

create table transactionIntent(
    id SERIAL PRIMARY KEY,
    buyerid int REFERENCES users(id),
    listingid int REFERENCES listings(id),
    stripeclientsecret varchar(255),
    offerId INTEGER REFERENCES offers(id),
    shippingAddress varchar(255),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT(now()),
    numberTries INTEGER default 1
);

create table categories(
    isActive boolean default false,
    id SERIAL PRIMARY KEY,
    name varchar(255),
    parentId integer,
    FOREIGN KEY(parentId) REFERENCES categories(id)
);

create table reservations(
    id SERIAL PRIMARY KEY,
    listingId integer,
    offerId INTEGER REFERENCES offers(id),
    buyerId integer,
    isexpired boolean default false,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT(GETDATE()),
    FOREIGN KEY(listingId) REFERENCES listings(id),
    FOREIGN KEY(buyerId) REFERENCES users(id)
);


create table notificationKeys(
    id SERIAL PRIMARY KEY,
    endpoint varchar(255),
    privatekey varchar(255),
    authKey varchar(255),
    userid integer references users(id),
    isValid boolean default true
);

create table employeeCredentials(
    id SERIAL PRIMARY KEY,
    name varchar(255),
    email varchar(255),
    password varchar(255),
    permission integer -- 0 = super admin
);

create table followUsers(
    id SERIAL PRIMARY KEY,
    followerId integer,
    followedUserId integer,
    FOREIGN KEY(followerId) REFERENCES users(id),
    FOREIGN KEY(followedUserId) REFERENCES users(id)
);

create table categoryTrends(
    id SERIAL PRIMARY KEY,
    catId REFERENCES categories(id),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT(now()),
);

create table blogPost(
    id SERIAL PRIMARY KEY,
    body text,
    title varchar(255),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT(now()),
    summary text
);

create table followCategories(
    id SERIAL PRIMARY KEY,
    followerId integer,
    categoryId integer,
    FOREIGN KEY(followerId) REFERENCES users(id),
    FOREIGN KEY(categoryId) REFERENCES categories(id)
);

create table listings(
    id SERIAL PRIMARY KEY,
    title varchar(255),
    description text,
    verificationTimestamp integer,
    sellerId INTEGER,
    FOREIGN KEY(sellerId) REFERENCES users(id),
    condition integer,
    price INTEGER,
    verificationPicture varchar(255),
    verificationStatus integer default 0, -- 0=not verified, 1 = in progress, 2 = refused, 3 = verified
    status integer, -- 0 = active / 1 = sold / 2 = cancelled
    timestamp TIMESTAMPTZ NOT NULL DEFAULT(GETDATE()),
    categoryId integer,
    pictures varchar(255)[],
    deleted boolean default false,
    predefType integer REFERENCES predefItem(id),
    FOREIGN KEY(categoryId) REFERENCES categories(id),
    isGuestListing boolean default false
);









create table predefItemFilterMap(
    id SERIAL PRIMARY KEY,
    filterId INTEGER,
    categoryId INTEGER,
    itemId integer,
    FOREIGN KEY(filterId) REFERENCES filterValues(id),
    FOREIGN KEY(categoryId) REFERENCES categories(id),
    FOREIGN KEY(itemId) REFERENCES predefItem(id),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT(now()),
);
create table predefItem(
    id SERIAL PRIMARY KEY,
    title varchar(255),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT(GETDATE()),
    categoryId integer,
    pictures varchar(255)[],
    sku varchar(255),
    FOREIGN KEY(categoryId) REFERENCES categories(id),
    isActualItem boolean default true
);












create table transactions(
    id SERIAL PRIMARY KEY,
    orderNb varchar(255),
    listingId INTEGER REFERENCES listings(id),
    buyerId INTEGER REFERENCES users(id),
    transactionIntentId INTEGER REFERENCES transactionIntent(id),
    reservationId INTEGER REFERENCES reservations(id),
    trackingNumber varchar(255),
    carrierName varchar(255),
    isSellerPaid boolean default false,
    sellerId INTEGER REFERENCES users(id),
    offerId INTEGER REFERENCES offers(id),
    isSellerReviewed boolean default false,
    shippingAddress varchar(255),
    isBuyerReviewed boolean default false,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT(now()),
    receiptLink varchar(255),
    sellerReceiptLink varchar(255),
    status INTEGER default 0 --0 = no tracking nb, 2 = shipped, 3 = delivered
);

create table activities(
    id SERIAL PRIMARY KEY,
    buyerId INTEGER,
    sellerId INTEGER,
    listingId INTEGER,
    type INTEGER,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT(GETDATE()),
    FOREIGN KEY(buyerId) REFERENCES users(id),
    FOREIGN KEY(sellerId) REFERENCES users(id),
    FOREIGN KEY(listingId) REFERENCES listings(id)
);

create table offers(
    id SERIAL PRIMARY KEY,
    listingId INTEGER,
    amount INTEGER,
    senderId INTEGER,
    receiverId INTEGER,
    status INTEGER, --0 = waiting / 1 = accepted / 2 = refused 
    timestamp TIMESTAMPTZ NOT NULL DEFAULT(GETDATE()),
    FOREIGN KEY(senderId) REFERENCES users(id),
    FOREIGN KEY(receiverId) REFERENCES users(id),
    FOREIGN KEY(listingId) REFERENCES listings(id)
);

create table blogPost(
    id SERIAL PRIMARY KEY,
    body text,
    summary text,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT(now()),
    title varchar(255)
);

create table reviews(
    id SERIAL PRIMARY KEY,
    reviewerId INTEGER,
    revieweeId INTEGER,
    rating integer,
    comment text,
    listingId integer,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT(GETDATE()),
    FOREIGN KEY(reviewerId) REFERENCES users(id),
    FOREIGN KEY(revieweeId) REFERENCES users(id),
    FOREIGN KEY(listingId) REFERENCES listings(id)
);

create table messages(
    id SERIAL PRIMARY KEY,
    senderId INTEGER,
    receiverId INTEGER,
    message text,
    listingId integer,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT(GETDATE()),
    FOREIGN KEY(senderId) REFERENCES users(id),
    FOREIGN KEY(receiverId) REFERENCES users(id),
    FOREIGN KEY(listingId) REFERENCES listings(id)
);








create table filterValues(
    id SERIAL PRIMARY KEY,
    filterTypeId integer,
    value real,
    textValue:varchar(255),
    FOREIGN KEY(filterTypeId) REFERENCES filterTypes(id),
);




create table filterMap(
    id SERIAL PRIMARY KEY,
    filterId INTEGER,
    categoryId INTEGER,
    listingId integer,
    FOREIGN KEY(filterId) REFERENCES filterValues(id),
    FOREIGN KEY(categoryId) REFERENCES categories(id),
    FOREIGN KEY(listingId) REFERENCES listings(id),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT(GETDATE()),
);
create table filterTypes(
    id SERIAL PRIMARY KEY,
    name varchar(255),
    significant boolean default false,
    type integer default 0, --0 = yes/no, 1 = select, 2=quantity
);
create table filterPerCategories(
    id SERIAL PRIMARY KEY,
    filterTypeId INTEGER,
    categoryId Integer,
    FOREIGN KEY(filterTypeId) REFERENCES filterTypes(id),
    FOREIGN KEY(categoryId) REFERENCES categories(id)
);




create table saved(
    id SERIAL PRIMARY KEY,
    userId INTEGER,
    listingId INTEGER,
    FOREIGN KEY(userId) REFERENCES users(id),
    FOREIGN KEY(listingId) REFERENCES listings(id)
);
CREATE TABLE waitlist(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    hasRegistered boolean default false
);