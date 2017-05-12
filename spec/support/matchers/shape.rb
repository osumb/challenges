RSpec::Matchers.define :be_shape_of do |expected|
  match do |actual|
    return false unless actual.keys.length == expected.keys.length
    actual.all? { |key, _| expected[key.to_sym] }
  end
end
