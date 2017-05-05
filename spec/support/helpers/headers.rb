def authenticated_header(user)
  token = Knock::AuthToken.new(payload: user.to_token_payload).token

  {
    'Accept': 'application/json, text/html',
    'Authorization': "Bearer #{token}",
    'CONTENT_TYPE' => 'application/json',
    'ACCEPT' => 'application/json'
  }
end
