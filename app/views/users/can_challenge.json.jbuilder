json.users do
  json.array! @users.each do |user|
    json.partial! 'users/user', user: user
  end
end
