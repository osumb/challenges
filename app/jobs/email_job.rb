class EmailJob < ApplicationJob
  queue_as :email

  def perform(klass:, method:, args:)
    klass.constantize.send(method, args.deep_symbolize_keys).deliver_now
  end
end
