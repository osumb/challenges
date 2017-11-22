class QueueNewPerformanceEmailsJob < ApplicationJob
  queue_as :queue_new_performance_emails

  def perform(performance_id:)
    PerformanceService.queue_new_performance_emails(performance_id: performance_id)
  end
end
