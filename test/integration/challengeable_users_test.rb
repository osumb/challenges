require 'test_helper'

class ChallengeableUsersTest < ActionDispatch::IntegrationTest
  def authenticated_header(user = nil)
    user = User.first if user.nil?
    token = Knock::AuthToken.new(payload: user.to_token_payload).token

    {
      'Accept': 'application/json, text/html',
      'Authorization': "Bearer #{token}"
    }
  end

  test 'it responds successfully' do
    get '/api/performances/challengeable_users', headers: authenticated_header

    assert_response :success
  end
end
