# handle process

## clear table
TRUNCATE TABLE `sku_value`;
TRUNCATE TABLE `values`;
TRUNCATE TABLE `properties`;
TRUNCATE TABLE `images`;
TRUNCATE TABLE `skus`;
TRUNCATE TABLE `product_frontend_category`;
TRUNCATE TABLE `products`;

## clear file
images/
error.log
error.txt
images.sql
product_frontend_category.sql
products.sql
properties.sql
sku_value.sql
skus.sql
test.sql
values.sql

## run
./babel-node index.js

# test data

INSERT INTO `products` (`id`, `shop_id`, `category_id`, `name`, `code`, `desc`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, 'G7三合一咖啡', '0001000001', '规格: 800G', '2017-07-08 19:07:04', '2017-07-08 19:07:04');

INSERT INTO `product_frontend_category` (`id`, `category_id`, `product_id`, `created_at`, `updated_at`) VALUES
(1, 373, 1, '2017-07-08 19:07:04', '2017-07-08 19:07:04');

INSERT INTO `skus` (`id`, `product_id`, `code`, `name`, `barcode`, `price`, `stock`, `unit`, `state`, `created_at`, `updated_at`) VALUES
(1, 1, '000100000101', '', '8935024129357', 3980, 1000, '包', 1, '2017-07-08 19:07:04', '2017-07-08 19:07:04');

INSERT INTO `images` (`id`, `sku_id`, `path`, `number`, `created_at`, `updated_at`) VALUES
(1, 1, '2017-07-08/1502104026361300.png', 1, '2017-07-08 19:07:04', '2017-07-08 19:07:04'),
(2, 1, '2017-07-08/1502104026366497.png', 2, '2017-07-08 19:07:04', '2017-07-08 19:07:04'),
(3, 1, '2017-07-08/1502104026367555.png', 3, '2017-07-08 19:07:04', '2017-07-08 19:07:04'),
(4, 1, '2017-07-08/1502104026369997.png', 4, '2017-07-08 19:07:04', '2017-07-08 19:07:04'),
(5, 1, '2017-07-08/1502104026409507.png', 5, '2017-07-08 19:07:04', '2017-07-08 19:07:04');

INSERT INTO `properties` (`id`, `name`, `type`, `desc`, `sort`, `created_at`, `updated_at`) VALUES

INSERT INTO `values` (`id`, `property_id`, `name`, `sort`, `created_at`, `updated_at`) VALUES

INSERT INTO `sku_value` (`id`, `sku_id`, `value_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2017-07-08 19:07:04', '2017-07-08 19:07:04'),
(2, 1, 2, '2017-07-08 19:07:04', '2017-07-08 19:07:04'),
(3, 1, 3, '2017-07-08 19:07:04', '2017-07-08 19:07:04'),
(4, 1, 4, '2017-07-08 19:07:04', '2017-07-08 19:07:04'),
(5, 1, 5, '2017-07-08 19:07:04', '2017-07-08 19:07:04'),
(6, 1, 6, '2017-07-08 19:07:04', '2017-07-08 19:07:04'),
(7, 1, 7, '2017-07-08 19:07:04', '2017-07-08 19:07:04'),
(8, 1, 8, '2017-07-08 19:07:04', '2017-07-08 19:07:04');
