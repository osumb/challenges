json.challengeableUsers do
  json.array! @users.each do |user|
    json.partial! 'performances/challengeable_user', user: user
  end
end

unless @performance.nil?
  json.performance do
    json.partial! 'performances/performance', performance: @performance
  end
end
