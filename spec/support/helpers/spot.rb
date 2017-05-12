def select_user_parts(parts)
  User.parts.select { |_key, value| parts.include? value }.each { |k, v| yield k, v }
end

def reject_user_parts(parts)
  User.parts.reject { |_key, value| parts.include? value }.each { |k, v| yield k, v }
end
