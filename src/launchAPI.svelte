<script context="module">
// Launch Library API https://ll.thespacedevs.com/2.2.0/launch/upcoming/
const apiUrl = `https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=12&offset=12`;

export const getData = async () => {
  try {
    const response = await fetch(apiUrl);
    if (response.ok) {
      const jsonResponse = await response.json();
      // console.log(jsonResponse.results);
      return jsonResponse.results;
    }
  } catch (error) {
    console.log(`Uh,oh! ${error}`);
  }
};
</script>

