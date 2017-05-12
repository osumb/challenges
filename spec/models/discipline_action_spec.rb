require 'rails_helper'

describe DisciplineAction, type: :model do
  it { is_expected.to validate_presence_of(:reason) }
  it { is_expected.to validate_presence_of(:open_spot) }
end
