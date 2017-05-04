json.id pcr.id
json.user do
  json.partial! '/users/user', user: pcr.user
end
json.used pcr.used
json.expires pcr.expires
