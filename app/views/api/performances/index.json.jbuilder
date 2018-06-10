json.performances do
  json.array! @performances.each do |p|
    json.partial! 'api/performances/performance', performance: p
  end
end
