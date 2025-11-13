package CSC340.demo.Cat;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(catRestController.class)
public class CatRestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private catService catService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testGetAllCats_returnsList() throws Exception {
        cat c1 = new cat(1L, "Whiskers", "Friendly", "Siamese", 2.0, "brown");
        cat c2 = new cat(2L, "Fluffy", "Playful", "Persian", 3.5, "white");
        List<cat> cats = Arrays.asList(c1, c2);
        when(catService.getAllCats()).thenReturn(cats);

        mockMvc.perform(get("/cats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    public void testCreateCat_returnsCreated() throws Exception {
        cat toCreate = new cat("Mittens", "Quiet cat", "Domestic", 1.5, "black");
        cat created = new cat(3L, "Mittens", "Quiet cat", "Domestic", 1.5, "black");
        when(catService.addCat(any(cat.class))).thenReturn(created);

        mockMvc.perform(post("/cats")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(toCreate)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.animalId").value(3));
    }
}
