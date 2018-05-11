module PerformanceHelper
  def self.next_performance
    @next_performance ||= Performance.next
  end
end
