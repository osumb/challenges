# If you want to use Nginx for a url without a port
## Mac

Open your system's nginx.conf (/urs/local/etc/nginx/nginx.conf)

There's 3 lines that read:
```
server {
    listen      8080;
    server_name localhost;
```

Edit to look:
```
server {
  listen      80;
  server_name app localhost;
```

Then restart nginx: ```sudo nginx -s stop && sudo nginx ```

## Any other OS

Good luck! :stuck_out_tongue_closed_eyes:
