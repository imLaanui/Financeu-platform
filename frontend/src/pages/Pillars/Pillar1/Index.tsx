import PillarLessons from "@components/PillarLessons";

const pillar1Lessons = [
    { id: 1, title: "Lesson 1 - What is Money?", description: "Understand the fundamental concept of money and its role in society", url: "/pillar1/lesson1" },
    { id: 2, title: "Lesson 2 - Understanding Income and Expenses", description: "Learn the difference between money coming in and money going out", url: "/pillar1/lesson2" },
    { id: 3, title: "Lesson 3 - The Time Value of Money", description: "Discover why money today is worth more than money tomorrow", url: "/pillar1/lesson3" },
    { id: 4, title: "Lesson 4 - Needs vs. Wants", description: "Master the crucial skill of distinguishing between necessities and desires", url: "/pillar1/lesson4" },
    { id: 5, title: "Lesson 5 - Setting Financial Goals", description: "Learn how to set and achieve meaningful financial objectives", url: "/pillar1/lesson5" },
    { id: 6, title: "Lesson 6 - Introduction to Banking", description: "Understand how banks work and the services they offer", url: "/pillar1/lesson6" },
    { id: 7, title: "Lesson 7 - Tracking Your Money", description: "Discover simple methods to monitor your financial activities", url: "/pillar1/lesson7" },
    { id: 8, title: "Lesson 8 - Building Good Money Habits", description: "Develop daily practices that lead to long-term financial success", url: "/pillar1/lesson8" },
];

export default function Pillar1Lessons() {
    return (
        <PillarLessons
            pillarNumber={1}
            pillarTitle="Financial Literacy Fundamentals"
            pillarDescription="Build your foundation with essential money management concepts and skills"
            lessons={pillar1Lessons}
        />
    );
}
