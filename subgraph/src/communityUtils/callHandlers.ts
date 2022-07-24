import { CreateCategoryCall } from "../../generated/Community/Community"
import { Categories, Category, Counters } from "../../generated/schema"

export function handleCreateCategory(call: CreateCategoryCall): void {
  let hash = call.transaction.hash

  let categories = Categories.load("1")
  if (!categories) {
    categories = new Categories("1")
  }

  let counters = Counters.load("1")
  if (!counters) {
    counters = new Counters("1")
  }

  counters.categories += 1

  let category = new Category(hash)
  category.name = call.inputs._name
  category.categories = "1"
  category.save()

  categories.categories.push(category.id)
  categories.save()
}
