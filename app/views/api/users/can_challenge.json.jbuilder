json.users do
  json.array! @users.each do |user|
    json.partial! "api/users/user", user: user
  end
end
