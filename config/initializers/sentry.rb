unless ENV["SENTRY_SERVER_DSN"].nil?
  Raven.configure do |c|
    c.dsn = ENV["SENTRY_SERVER_DSN"]
    c.sanitize_fields = Rails.application.config.filter_parameters.map(&:to_s)
  end
end
