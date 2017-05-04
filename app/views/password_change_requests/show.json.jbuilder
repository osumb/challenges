json.passwordChangeRequest do
  json.partial! '/password_change_requests/password_change_request', pcr: @pcr
end
