FROM httpd:2.4-alpine
RUN echo "LoadModule rewrite_module modules/mod_rewrite.so" \
    >> /usr/local/apache2/conf/httpd.conf
COPY dist/favtoon-angular/browser/ /usr/local/apache2/htdocs/
COPY httpd.conf /usr/local/apache2/conf/httpd.conf