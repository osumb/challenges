json.user do
  json.partial! 'users/user', user: @user
end

json.nextPerformance do
  return if @next_performance.nil?
  json.partial! 'performances/performance', performance: @next_performance
end
