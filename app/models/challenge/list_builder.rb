require 'rubyXL'

class Challenge
  class ListBuilder
    def initialize(performance_id)
      @performance = Performance.find(performance_id)
      @challenges = @performance.challenges
      @discipline_actions = @performance.discipline_actions
      @date = Time.zone.now.strftime('%m-%d-%Y')
      @workbook = RubyXL::Workbook.new
      @worksheet = @workbook[0]
      @worksheet.sheet_name = "Challenge List #{@date}"
      @worksheet.add_cell(0, 0, "OSUMB Challenges #{@date}")
      @worksheet.add_cell(1, 0, 'Challenges')
      @list_built = false
    end

    # rubocop:disable Metrics/MethodLength
    def build_challenge_list
      challenge_rows = challenge_list_to_rows(@challenges.sort_by(&:spot))
      discipline_action_rows = discipline_actions_to_rows(@discipline_actions)
      challenge_rows.each_with_index do |row, i|
        add_row_to_worksheet(i + 2, row)
      end
      add_row_to_worksheet(challenge_rows.length + 2, [])
      add_row_to_worksheet(challenge_rows.length + 3, ['Open Spots/Automatic Alternates'])
      discipline_action_rows.each_with_index do |row, i|
        add_row_to_worksheet(2 + challenge_rows.length + 2 + i, row)
      end
      @list_built = true
    end
    # rubocop:enable Metrics/MethodLength

    def write_list_to_buffer
      @workbook.stream
    end

    private

    def add_row_to_worksheet(row_number, row)
      row.each_with_index { |v, i| @worksheet.add_cell(row_number, i, v) }
    end

    def discipline_actions_to_rows(discipline_actions)
      discipline_actions.map { |da| discipline_action_to_list_row(da) }
    end

    def discipline_action_to_list_row(da)
      [da.user.spot.to_s, da.user.full_name, da.reason]
    end

    def challenge_list_to_rows(challenges)
      challenges.map { |c| challenge_to_list_row(c) }
    end

    def challenge_to_list_row(challenge)
      if challenge.normal_challenge_type?
        normal_challenge_to_list_row(challenge)
      elsif challenge.open_spot_challenge_type?
        open_spot_challenge_to_list_rows(challenge).flatten
      elsif challenge.tri_challenge_type?
        tri_challenge_to_list_row(challenge)
      else
        Raise 'Unsupported challenge type'
      end
    end

    def normal_challenge_to_list_row(challenge)
      challenger = challenge.user_challenges.select { |uc| uc.spot != challenge.spot }.first.user
      challengee = challenge.users.select { |u| u != challenger }.first
      [challenger.spot.to_s, challenger.full_name, challenge.spot.to_s, challengee.full_name]
    end

    def open_spot_challenge_to_list_rows(challenge)
      challenge.user_challenges.map do |uc|
        [uc.spot.to_s, uc.user.full_name, challenge.spot.to_s, 'Open Spot']
      end
    end

    def tri_challenge_to_list_row(challenge)
      challengers = challenge.user_challenges.select { |uc| uc.spot != challenge.spot }.sort(&:spot)
      challengee = challenge.user_challenges.reject { |uc| uc.spot != challenge.spot }
      [
        "#{challengers.first.spot}, #{challengers.last.spot}",
        "#{challengers.first.user.full_name}, #{challengers.last.user.full_name}",
        challenge.spot.to_s,
        challengee.user.full_name
      ]
    end

    def create_challenge_list_dir
      return unless Dir.exist? tmp_dir
      FileUtils.mkdir_p tmp_dir
    end

    def tmp_dir
      Rails.root.join('tmp', 'challenge_lists')
    end
  end
end
