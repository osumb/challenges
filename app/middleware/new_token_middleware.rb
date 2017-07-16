require 'date'
require 'jwt'

class NewTokenMiddleware
  def initialize(app)
    @app = app
  end

  # rubocop:disable all
  def call(env)
    status, headers, response = @app.call(env)
    begin
      if status < 400 && headers['Content-Type']&.include?('application/json') && env['HTTP_AUTHORIZATION'] && env['HTTP_AUTHORIZATION'] != 'undefined'
        auth = env['HTTP_AUTHORIZATION'].split(' ').last
        decoded_token = JWT.decode auth, Rails.application.secrets.secret_key_base, true, algorithm: 'HS256'
        buck_id = decoded_token.first['buckId']
        user = User.find buck_id
        if user.revoke_token_date&.to_i > decoded_token.first['issuedAt']
          status = 404
          body = { message: 'Expired Token' }
          response = [body.to_json]
        else
          jwt = Knock::AuthToken.new payload: user.to_token_payload
          body = JSON.parse(response.body)
          body['jwt'] = jwt.token
          response = [body.to_json]
        end
      end
    rescue Exception => e
      puts e.message
      [status, headers, response]
    end
    [status, headers, response]
  end
  # rubocop:enable all
end
