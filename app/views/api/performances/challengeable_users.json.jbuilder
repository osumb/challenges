json.challengeable_users do
  json.array! @users.each do |user|
    json.partial! 'api/performances/challengeable_user', user: user
  end
end

unless @performance.nil?
  json.performance do
    json.partial! 'api/performances/performance', performance: @performance
  end
end
