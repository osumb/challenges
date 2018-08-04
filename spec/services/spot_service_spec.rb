require "rails_helper"

describe SpotService do
  context ".find" do
    let!(:spot) { create(:spot) }

    it "finds the spot with the correct query" do
      result = described_class.find(query: "#{spot.row}#{spot.file}")

      expect(result).to eq(spot)
    end

    it "doesn't find a spot with a bad query" do
      result = described_class.find(query: "horrible query?!?!")

      expect(result).to be_nil
    end
  end
end
