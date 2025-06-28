FROM httpd:2.4.63-alpine3.22
COPY dist/favtoon-angular/browser/ /usr/local/apache2/htdocs/
COPY .htaccess /usr/local/apache2/htdocs/