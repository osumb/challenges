json.id user.id
json.buckId user.buck_id
json.firstName user.first_name
json.lastName user.last_name
json.email user.email
json.role user.role.camelcase
json.instrument user.instrument.titleize
json.part user.part.titleize

json.spot do
  json.partial! 'spots/spot', spot: user.spot
end
