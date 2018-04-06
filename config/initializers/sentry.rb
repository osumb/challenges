if !ENV["SENTRY_SERVER_DSN"].nil? && Rails.env.production?
  Raven.configure do |c|
    c.dsn = ENV["SENTRY_SERVER_DSN"]
    c.sanitize_fields = Rails.application.config.filter_parameters.map(&:to_s)
  end
end
