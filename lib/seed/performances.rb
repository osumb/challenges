def current_performance
  Performance.new(
    name: 'Oklahoma Game',
    date: Time.zone.now + 2.days,
    window_open: Time.zone.now,
    window_close: Time.zone.now + 3.hours
  )
end

def past_performance
  Performance.new(
    name: 'Indiana Game',
    date: Time.zone.now - 3.days,
    window_open: Time.zone.now - 1.day,
    window_close: Time.zone.now - 1.day + 3.hours
  )
end
