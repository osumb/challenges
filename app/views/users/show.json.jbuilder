json.user do
  json.partial! 'users/user', user: @user
end
json.disciplineActions do
  json.array! @user.discipline_actions.each do |da|
    json.partial! 'discipline_actions/discipline_action', discipline_action: da
  end
end
if @performance.nil?
  json.performance nil
else
  json.performance do
    json.partial! 'performances/performance', performance: @performance
  end
end
