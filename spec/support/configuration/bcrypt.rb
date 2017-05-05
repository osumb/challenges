require "bcrypt"

silence_warnings do
  BCrypt::Engine::DEFAULT_COST = BCrypt::Engine::MIN_COST
end
