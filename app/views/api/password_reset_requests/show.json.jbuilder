json.passwordResetRequest do
  json.partial! "api/password_reset_requests/password_reset_request", prr: @prr
end
