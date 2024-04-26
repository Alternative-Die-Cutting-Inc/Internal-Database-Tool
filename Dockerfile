
FROM php:5.6-apache
RUN docker-php-ext-install mysql
RUN docker-php-ext-enable mysql
RUN apachectl restart
EXPOSE 80