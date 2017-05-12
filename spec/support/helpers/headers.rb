def authenticated_header(user)
  token = Knock::AuthToken.new(payload: user.to_token_payload).token

  {
    'Authorization' => "Bearer #{token}",
    'CONTENT_TYPE' => 'application/json',
    'ACCEPT' => 'application/json'
  }
end

def unauthenticated_header
  {
    'CONTENT_TYPE' => 'application/json',
    'ACCEPT' => 'application/json'
  }
end
