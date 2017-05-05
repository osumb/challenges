def matches_shape?(shape, model)
  return false unless model.keys.length == shape.keys.length
  model.all? { |key, _| shape[key.to_sym] }
end
