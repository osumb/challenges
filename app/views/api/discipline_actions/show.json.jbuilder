if @da.nil?
  json.disciplineAction nil
else
  json.partial! "api/discipline_actions/discipline_action", discipline_action: @da
end
