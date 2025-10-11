package CSC340.demo.Cat; //locates this class and groups it with the other classes

//imports necessary info for the class to run
import jakarta.persistence.Column; 
import jakarta.persistence.Entity; 
import jakarta.persistence.GeneratedValue; 
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

//JPA entity, maps to table cat
@Entity
@Table(name = "cats")
public class cat {
    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto-generate the ID
    private Long animalId;  //unique ID for each cat

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    private String breed;
    private double age;
    private String color;

    // Constructor for the cat class
    public cat() {
    }

    // Parameterized constructor
    public cat(Long animalId, String name, String description, String breed, double age, String color) {
        this.animalId = animalId;
        this.name = name;
        this.description = description;
        this.breed = breed;
        this.age = age;
        this.color = color;
    }

    // Constructor without ID since it's auto-generated for new cats
    public cat(String name, String description, String breed, double age, String color) {
        this.name = name;
        this.description = description;
        this.breed = breed;
        this.age = age;
        this.color = color;
    }

    // Getters and Setters
    public Long getAnimalId() {
        return animalId;
    }

    public void setAnimalId(Long animalId) {
        this.animalId = animalId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }

    public double getAge() {
        return age;
    }

    public void setAge(double age) {
        this.age = age;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
