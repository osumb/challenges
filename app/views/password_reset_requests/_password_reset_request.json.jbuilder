json.id prr.id
json.user do
  json.partial! '/users/user', user: prr.user
end
json.used prr.used
json.expires prr.expires
