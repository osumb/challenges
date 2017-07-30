class Result
  attr_reader :errors, :result, :status

  def initialize(status:, errors: nil, result: nil)
    @errors = errors
    @result = result
    @status = status
  end

  def success?
    @status == :success
  end

  def failure?
    @status == :failure
  end

  def self.success(result: nil)
    new(status: :success, result: result)
  end

  def self.failure(errors: nil)
    new(status: :failure, errors: errors)
  end
end
