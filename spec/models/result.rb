require "rails_helper"

describe Result, type: :model do
  let(:a_result) { "a result" }
  let(:errors) { ["error"] }

  describe "#success?" do
    context "when the result was successful" do
      subject(:result) { described_class.success }

      specify { expect(result.success?).to be(true) }
    end

    context "when the result was not successful" do
      subject(:result) { described_class.failure }

      specify { expect(result.success?).to be(false) }
    end
  end

  describe "#failure?" do
    context "when the result was successful" do
      subject(:result) { described_class.success }

      specify { expect(result.failure?).to be(false) }
    end

    context "when the result was not successful" do
      subject(:result) { described_class.failure }

      specify { expect(result.failure?).to be(true) }
    end
  end

  describe ".success" do
    context "when given a result" do
      subject(:result) { described_class.success(result: a_result) }

      specify { expect(result.success?).to be(true) }
      specify { expect(result.failure?).to be(false) }
      specify { expect(result.result).to eq(a_result) }
      specify { expect(result.errors).to be_nil }
    end

    context "when not given a result" do
      subject(:result) { described_class.success }

      specify { expect(result.success?).to be(true) }
      specify { expect(result.failure?).to be(false) }
      specify { expect(result.result).to be_nil }
      specify { expect(result.errors).to be_nil }
    end
  end

  describe ".failure" do
    context "when given errors" do
      subject(:result) { described_class.failure(errors: errors) }

      specify { expect(result.success?).to be(false) }
      specify { expect(result.failure?).to be(true) }
      specify { expect(result.result).to be_nil }
      specify { expect(result.errors).to eq(errors) }
    end

    context "when not given errors" do
      subject(:result) { described_class.failure }

      specify { expect(result.success?).to be(false) }
      specify { expect(result.failure?).to be(true) }
      specify { expect(result.result).to be_nil }
      specify { expect(result.errors).to be_nil }
    end
  end
end
