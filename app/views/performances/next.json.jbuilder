if @performance.nil?
  json.performance nil
else
  json.performance do
    json.partial! '/performances/performance', performance: @performance
  end
end
