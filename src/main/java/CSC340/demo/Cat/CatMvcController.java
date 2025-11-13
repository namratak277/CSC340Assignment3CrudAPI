package CSC340.demo.Cat;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/web/cats")
public class CatMvcController {
    @Autowired
    private catService catService;

    @GetMapping
    public String listCats(@RequestParam(required = false) String name,
                           @RequestParam(required = false) String breed,
                           @RequestParam(required = false) String color,
                           Model model) {
        List<cat> cats;
        if (name != null && !name.isBlank()) {
            cats = catService.searchCatsByName(name);
        } else if (breed != null && !breed.isBlank()) {
            cats = catService.getCatsByBreed(breed);
        } else if (color != null && !color.isBlank()) {
            cats = catService.getCatsByColor(color);
        } else {
            cats = catService.getAllCats();
        }
        model.addAttribute("cats", cats);
        model.addAttribute("searchName", name == null ? "" : name);
        return "cats/list";
    }

    @GetMapping("/new")
    public String newCatForm(Model model) {
        model.addAttribute("cat", new cat());
        model.addAttribute("isNew", true);
        return "cats/form";
    }

    @PostMapping
    public String createCat(@ModelAttribute cat cat) {
        catService.addCat(cat);
        return "redirect:/web/cats";
    }

    @GetMapping("/{id}/edit")
    public String editCatForm(@PathVariable Long id, Model model) {
        var opt = catService.getCatById(id);
        if (opt.isEmpty()) {
            return "redirect:/web/cats";
        }
        model.addAttribute("cat", opt.get());
        model.addAttribute("isNew", false);
        return "cats/form";
    }

    @PostMapping("/{id}")
    public String updateCat(@PathVariable Long id, @ModelAttribute cat cat) {
        catService.updateCat(id, cat);
        return "redirect:/web/cats";
    }

    @PostMapping("/{id}/delete")
    public String deleteCat(@PathVariable Long id) {
        catService.deleteCat(id);
        return "redirect:/web/cats";
    }
}
