json.id user.id
json.buck_id user.buck_id
json.first_name user.first_name
json.last_name user.last_name
json.email user.email
json.role user.role.camelcase
json.instrument user.instrument.titleize
json.part user.part.titleize

json.current_spot do
  json.partial! "api/spots/spot", spot: user.current_spot
end

json.original_spot do
  json.partial! "api/spots/spot", spot: user.original_spot
end
