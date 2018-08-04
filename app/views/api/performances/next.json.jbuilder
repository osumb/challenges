if @performance.nil?
  json.performance nil
else
  json.performance do
    json.partial! "api/performances/performance", performance: @performance
  end
end
