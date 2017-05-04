json.PasswordResetRequest do
  json.partial! '/password_reset_requests/password_reset_request', prr: @prr
end
