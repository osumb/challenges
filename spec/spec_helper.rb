def run_background_jobs_immediately
  inline = Resque.inline
  Resque.inline = true
  yield
  Resque.inline = inline
end

RSpec.configure do |config|
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end

  config.shared_context_metadata_behavior = :apply_to_host_groups

  config.around(:each) do |example|
    run_background_jobs_immediately do
      example.run
    end
  end
end
