class Spot < ApplicationRecord
  # enums
  enum row: %i[a b c e f h i j k l m q r s t x]

  # associations
  has_many :challenges, dependent: :destroy
  has_one :current_user, class_name: 'User', foreign_key: 'current_spot_id', dependent: :destroy
  has_one :original_user, class_name: 'User', foreign_key: 'original_spot_id', dependent: :destroy

  # validations
  validates :row, presence: true
  validates :file, presence: true

  def <=>(other)
    return file <=> other.file if row == other.row
    row <=> other.row
  end

  def >(other)
    (self <=> other).positive?
  end

  def <(other)
    (self <=> other).negative?
  end

  def to_s
    "#{row.upcase}#{file}"
  end

  class << self
    # rubocop:disable Metrics/MethodLength, Style/IndentationConsistency
    def valid_instrument_part_for_row(row, instrument, part)
      case row
      when Spot.rows[:a], Spot.rows[:x]
        valid_a_x_row_instrument_part(instrument, part)
      when Spot.rows[:b], Spot.rows[:t]
        valid_b_t_row_instrument_part(instrument, part)
      when Spot.rows[:c]
        valid_c_row_instrument_part(instrument, part)
      when Spot.rows[:e], Spot.rows[:r]
        valid_e_r_row_instrument_part(instrument, part)
      when Spot.rows[:f], Spot.rows[:q]
        valid_f_q_row_instrument_part(instrument, part)
      when Spot.rows[:h], Spot.rows[:m]
        valid_h_m_row_instrument_part(instrument, part)
      when Spot.rows[:i]
        valid_i_row_instrument_part(instrument, part)
      when Spot.rows[:j]
        valid_j_row_instrument_part(instrument, part)
      when Spot.rows[:k], Spot.rows[:l]
        valid_k_l_row_instrument_part(instrument, part)
      else Spot.rows[:s]
        valid_s_row_instrument_part(instrument, part)
      end
    end
    # rubocop:enable Metrics/MethodLength, Style/IndentationConsistency

    def get_row_from_database_value(db_value)
      Spot.rows.find { |_key, value| db_value == value }.first
    end

    private

    def valid_a_x_row_instrument_part(instrument, part)
      instruments = User.instruments
      parts = User.parts
      valid_instruments = [instruments[:trumpet]]
      valid_parts = [parts[:efer], parts[:solo], parts[:first]]
      valid_instruments.include?(instrument) && valid_parts.include?(part)
    end

    def valid_b_t_row_instrument_part(instrument, part)
      instruments = User.instruments
      parts = User.parts
      valid_instruments = [instruments[:trumpet]]
      valid_parts = [parts[:first], parts[:second]]
      valid_instruments.include?(instrument) && valid_parts.include?(part)
    end

    def valid_c_row_instrument_part(instrument, part)
      instruments = User.instruments
      parts = User.parts
      valid_instruments = [instruments[:trumpet]]
      valid_parts = [parts[:flugel]]
      valid_instruments.include?(instrument) && valid_parts.include?(part)
    end

    def valid_e_r_row_instrument_part(instrument, part)
      instruments = User.instruments
      parts = User.parts
      valid_instruments = [instruments[:mellophone]]
      valid_parts = [parts[:first], parts[:second]]
      valid_instruments.include?(instrument) && valid_parts.include?(part)
    end

    def valid_f_q_row_instrument_part(instrument, part)
      instruments = User.instruments
      parts = User.parts
      valid_instruments = [instruments[:trombone]]
      valid_parts = [parts[:first], parts[:second], parts[:bass]]
      valid_instruments.include?(instrument) && valid_parts.include?(part)
    end

    def valid_h_m_row_instrument_part(instrument, part)
      instruments = User.instruments
      parts = User.parts
      valid_instruments = [instruments[:baritone]]
      valid_parts = [parts[:first]]
      valid_instruments.include?(instrument) && valid_parts.include?(part)
    end

    def valid_i_row_instrument_part(instrument, part)
      instruments = User.instruments
      parts = User.parts
      valid_instruments = [instruments[:percussion]]
      valid_parts = [parts[:snare]]
      valid_instruments.include?(instrument) && valid_parts.include?(part)
    end

    def valid_j_row_instrument_part(instrument, part)
      instruments = User.instruments
      parts = User.parts
      valid_instruments = [instruments[:percussion]]
      valid_parts = [parts[:cymbals], parts[:bass], parts[:tenor]]
      valid_instruments.include?(instrument) && valid_parts.include?(part)
    end

    def valid_k_l_row_instrument_part(instrument, part)
      instruments = User.instruments
      parts = User.parts
      valid_instruments = [instruments[:sousaphone]]
      valid_parts = [parts[:first]]
      valid_instruments.include?(instrument) && valid_parts.include?(part)
    end

    def valid_s_row_instrument_part(instrument, part)
      instruments = User.instruments
      parts = User.parts
      valid_instruments = [instruments[:trumpet]]
      valid_parts = [parts[:second], parts[:flugel]]
      valid_instruments.include?(instrument) && valid_parts.include?(part)
    end
  end
end
