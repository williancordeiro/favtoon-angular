FROM httpd:alpine
RUN rm -rf /usr/local/apache2/htdocs/*
COPY ./dist/favtoon-angular /usr/local/apache2/htdocs/