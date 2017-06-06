json.performances do
  json.array! @performances.each do |p|
    json.partial! 'performances/performance', performance: p
  end
end
